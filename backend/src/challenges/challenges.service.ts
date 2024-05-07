import { Injectable } from '@nestjs/common';
import { Challenges } from './challenges.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Repository, createQueryBuilder } from 'typeorm';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { InvitationsService } from 'src/invitations/invitations.service';
import { Users } from 'src/users/entities/users.entity';
import { AcceptInvitationDto } from './dto/acceptInvitaion.dto';
import {
  ChallengeResponseDto,
  ParticipantDto,
} from './dto/challengeResponse.dto';
import { Attendance } from 'src/attendance/attendance.entity';
import { Invitations } from 'src/invitations/invitations.entity';
import { ChallengeResultDto } from './dto/challengeResult.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenges)
    private challengeRepository: Repository<Challenges>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private invitationService: InvitationsService,
    @InjectRepository(Invitations)
    private invitaionRepository: Repository<Invitations>,
  ) {
    this.challengeRepository = challengeRepository;
  }

  async createChallenge(challenge: CreateChallengeDto): Promise<Challenges> {
    const newChallenge = new Challenges();
    newChallenge.hostId = challenge.hostId;
    newChallenge.startDate = challenge.startDate;
    newChallenge.wakeTime = challenge.wakeTime;
    newChallenge.duration = challenge.duration;
    return await this.challengeRepository.save(challenge);
  }

  async searchAvailableMate(email: string): Promise<boolean> {
    const availUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (availUser.challengeId > 0) {
      return true;
    } else {
      return false;
    }
  }

  async hostChallengeStatus(hostId: number): Promise<number> {
    const challengeId = await this.challengeRepository.findOne({
      where: { hostId },
    });
    const user = await this.userRepository.findOneBy({ _id: hostId });
    if (user && challengeId) {
      user.challengeId = challengeId._id;
      await this.userRepository.save(user);
      return challengeId._id;
    }
    return null;
  }
  async sendInvitation(challengeId: number, email: string): Promise<void> {
    console.log('sendInvitation', email);
    const user = await this.userRepository.findOne({ where: { email: email } });
    await this.invitationService.createInvitation(challengeId, user._id);
  }

  async acceptInvitation(invitation: AcceptInvitationDto) {
    const challengeId = invitation.challengeId;
    const guestId = invitation.guestId;
    // const { challengeId, guestId } = invitation;
    const responseDatedate = new Date();
    try {
      await Promise.all([
        this.invitaionRepository.update(
          { guestId },
          {
            responseDate: responseDatedate,
            isExpired: true,
          },
        ),
        this.userRepository.update(
          { _id: guestId },
          {
            challengeId: challengeId,
          },
        ),
      ]); // 여러개의 비동기 함수를 동시에 실행
      return { success: true, message: '승낙 성공' };
    } catch (e) {
      console.error('Failed to accept invitation or update user:', e);
      throw new Error('Error processing your invitation acceptance.');
    }
  }

  async getChallengeInfo(
    challengeId: number,
  ): Promise<ChallengeResponseDto | null> {
    // 먼저 챌린지 정보를 가져옵니다.
    const challenge = await this.challengeRepository.findOne({
      where: { _id: challengeId },
    });
    if (!challenge) {
      return null; // 챌린지가 없으면 null 반환
    }

    // 해당 챌린지 ID를 가진 모든 사용자 검색
    const participants = await this.userRepository.find({
      where: { challengeId: challenge._id },
    });

    // 참가자 정보를 DTO 형식으로 변환
    const participantDtos: ParticipantDto[] = participants.map((user) => ({
      userId: user._id,
      userName: user.userName,
    }));
    return {
      challengeId: challenge._id,
      startDate: challenge.startDate,
      wakeTime: challenge.wakeTime,
      duration: challenge.duration,
      mates: participantDtos,
    };
  }
  async getChallengeCalendar(userId: number, month: number): Promise<string[]> {
    const currentYear = new Date().getFullYear(); // 현재 연도를 가져옴
    const startDate = new Date(currentYear, month - 1, 1); // 월은 0부터 시작하므로 month - 1
    const endDate = new Date(currentYear, month, 0); // 해당 월의 마지막 날짜를 구함
    const attendances = await this.attendanceRepository.find({
      where: {
        user: { _id: userId },
        date: Between(startDate, endDate),
      },
    });
    return attendances.map(
      (attendance) => attendance.date.toISOString().split('T')[0],
    ); // 날짜만 반환
  }

  async getInvitations(guestId: number) {
    const invitations = await this.invitaionRepository.find({
      where: {
        guestId: guestId,
        isExpired: false,
        responseDate: IsNull(),
      },
      relations: ['challenge', 'challenge.host'],
    });
    console.log('invi', invitations);
    return invitations.map((inv) => ({
      challengeId: inv.challengeId,
      startDate: inv.challenge.startDate,
      wakeTime: inv.challenge.wakeTime,
      duration: inv.challenge.duration,
      isExpired: inv.isExpired,
      userName: inv.challenge.host.userName,
      sendDate: inv.sendDate,
      responseDate: inv.responseDate,
    }));
  }

  async getResultsByDateAndUser(
    userId: number,
    date: Date,
  ): Promise<ChallengeResultDto[]> {
    // 먼저 사용자가 참여하고 있는 챌린지 ID를 조회
    const userWithChallenge = await this.userRepository.findOne({
      where: { _id: userId },
    });
    if (!userWithChallenge || !userWithChallenge.challengeId) {
      throw new Error('No challenge found for the user.');
    }

    const challengeId = userWithChallenge.challengeId;

    // 해당 챌린지 ID와 일치하는 날짜에 모든 참석 기록을 조회
    const attendances = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.user', 'user')
      .select(['attendance.score', 'user.userName', 'user._id']) // 필요한 필드만 선택
      .where(
        'attendance.challengeId = :challengeId AND attendance.date = :date',
        { challengeId, date },
      )
      .getMany();

    // 결과 데이터 매핑
    return attendances.map((attendance) => ({
      userName: attendance.user.userName,
      score: attendance.score,
    }));
  }
}
