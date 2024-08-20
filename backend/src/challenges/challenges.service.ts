import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Challenges } from './challenges.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  IsNull,
  MoreThan,
  Repository,
  createQueryBuilder,
} from 'typeorm';
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
import RedisCacheService from 'src/redis-cache/redis-cache.service';
import { UserService } from 'src/users/users.service';

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

    private readonly redisCacheService: RedisCacheService,
    private readonly userService: UserService,
  ) {
    this.challengeRepository = challengeRepository;
  }

  async createChallenge(challenge: CreateChallengeDto): Promise<Challenges> {
    const newChallenge = new Challenges();
    const endDate = new Date(challenge.startDate);
    endDate.setDate(endDate.getDate() + challenge.duration - 1); // durationDays가 10일이라면 10일째 되는 날로 설정
    newChallenge.hostId = challenge.hostId;
    newChallenge.startDate = challenge.startDate;
    newChallenge.wakeTime = challenge.wakeTime;
    newChallenge.duration = challenge.duration;
    newChallenge.endDate = endDate;
    newChallenge.expired = false;
    newChallenge.deleted = false;
    // 챌린지 생성시 new가 아닌 인자 그대로 save하는 에러가 있었음
    return await this.challengeRepository.save(newChallenge);
  }

  /// 하다가 맘 -> DTO 추가하고 수정 2024-08-09
  // controller 필요
  // expired, deleted 추가???
  async editChallenge(challenge: CreateChallengeDto): Promise<Challenges> {
    const editChall = await this.challengeRepository.findOne({
      where: { hostId: challenge.hostId },
    });
    if (!editChall) {
      //host 권한이 없는 챌린지 수정 시 에러처리
      throw new NotFoundException(
        `Challenge with ID ${challenge.hostId} not found`,
      );
    }

    const endDate = new Date(challenge.startDate);
    endDate.setDate(endDate.getDate() + challenge.duration - 1); // durationDays가 10일이라면 10일째 되는 날로 설정

    editChall.startDate = challenge.startDate;
    editChall.wakeTime = challenge.wakeTime;
    editChall.duration = challenge.duration;
    editChall.endDate = endDate;
    editChall.expired = false;
    editChall.deleted = false;

    return await this.challengeRepository.save(editChall);
  }

  async endChallenge(challengeId: number): Promise<boolean> {
    // 시간까지 비교 필요
    //캐시에 챌린지 정보 있나?
    // 캐시여부에 따라 코딩
    // id로 챌린지 정보 가져온다음 현재 시간과 비교
    // const result = await this.redisService.del(`challengeId:${challengeId}`);
    // if (result) {
    //   return true;
    // }
    // return false;
    const challenge = await this.challengeRepository.findOne({
      where: { _id: challengeId },
    });
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }
    const currentDate = new Date();
    return currentDate > challenge.endDate;
  }

  // 챌린지 ID 랑 userID 둘다 받아서 호스트인지 확인하고 삭제로 수정
  // 호스트ID 하나로만 조회 ?? -> 챌린지ID랑 호스트 ID 말고 ?
  // 모두가 호출가능 ?? -> 프론트 또는 백에서 host인지 아닌지 확인 후 그에따른 결과값 송출 ???
  async deleteChallenge(
    challengeId: number,
    hostId: number,
  ): Promise<Challenges> {
    const challenge = await this.challengeRepository.findOne({
      where: { _id: challengeId, hostId: hostId },
    });
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }
    await this.challengeRepository.delete(challengeId);
    return challenge;
  }

  async challengeGiveUp(challengeId: number, userId: number): Promise<void> {
    const challenge = await this.challengeRepository.findOne({
      where: { _id: challengeId },
    });
    const users = await this.userRepository.findBy({
      challengeId: challengeId,
    });
    if (users.length === 1) {
      // 혼자인경우 당연히 호스트인데 예외처리 해줘야하나?
      challenge.deleted = true;
    } else if (users.length > 1) {
      if (challenge.hostId === userId) {
        // host가 아닌 다른 유저에게 챌린지를 넘기는 경우
        const newHost = users.find((user) => user._id !== challenge.hostId);
        challenge.hostId = newHost._id;
      }
    }
    // if 문 변경 필요

    await this.challengeRepository.save(challenge);
    await this.userService.resetChallenge(userId);
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
        this.redisCacheService.del(`userInfo:${guestId}`),
        this.redisCacheService.del(`challenge_${challengeId}`),
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
    const cacheKey = `challenge_${challengeId}`;

    if (challengeId > 0) {
      // 캐시에서 데이터 가져오기 시도
      const cachedChallenge = await this.redisCacheService.get(cacheKey);
      console.log(cachedChallenge);
      if (cachedChallenge) {
        return JSON.parse(cachedChallenge) as ChallengeResponseDto;
      }
    }

    // 캐시 미스 시 데이터베이스에서 가져오기
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

    const challengeResponse: ChallengeResponseDto = {
      challengeId: challenge._id,
      startDate: challenge.startDate,
      wakeTime: challenge.wakeTime,
      duration: challenge.duration,
      mates: participantDtos,
    };

    if (challengeId > 0) {
      // 결과를 캐시에 저장
      await this.redisCacheService.set(
        cacheKey,
        JSON.stringify(challengeResponse),
        parseInt(process.env.REDIS_CHALLENGE_EXP),
      ); // 10분 TTL
    }

    return challengeResponse;
  }

  // async getChallengeInfo(
  //   challengeId: number,
  // ): Promise<ChallengeResponseDto | null> {
  //   // 먼저 챌린지 정보를 가져옵니다.
  //   const challenge = await this.challengeRepository.findOne({
  //     where: { _id: challengeId },
  //   });
  //   if (!challenge) {
  //     return null; // 챌린지가 없으면 null 반환
  //   }

  //   // 해당 챌린지 ID를 가진 모든 사용자 검색
  //   const participants = await this.userRepository.find({
  //     where: { challengeId: challenge._id },
  //   });

  //   // 참가자 정보를 DTO 형식으로 변환
  //   const participantDtos: ParticipantDto[] = participants.map((user) => ({
  //     userId: user._id,
  //     userName: user.userName,
  //   }));
  //   return {
  //     challengeId: challenge._id,
  //     startDate: challenge.startDate,
  //     wakeTime: challenge.wakeTime,
  //     duration: challenge.duration,
  //     mates: participantDtos,
  //   };
  // }
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
    console.log(attendances);
    return attendances.map((attendance) => {
      // attendance.date가 Date 객체인지 확인하고, 그렇지 않다면 변환
      const date = new Date(attendance.date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date.toISOString().split('T')[0];
    }); // 날짜만 반환
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
    const nowAttendance = await this.attendanceRepository.findOne({
      where: { userId: userId, date: date },
    });

    if (!nowAttendance) {
      throw new HttpException(
        'Attendance does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const challengeId = nowAttendance.challengeId;

    // 해당 챌린지 ID와 일치하는 날짜에 모든 참석 기록을 조회
    const attendances = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.user', 'user')
      .leftJoinAndSelect('attendance.challenge', 'challenge')
      .select([
        'attendance.score',
        'user.userName',
        'user._id',
        'challenge.wakeTime',
      ]) // 필요한 필드만 선택
      .where(
        'attendance.challengeId = :challengeId AND attendance.date = :date',
        { challengeId, date },
      )
      .orderBy('attendance.score', 'DESC') // 점수 내림차순 정렬
      .getMany();

    // 결과 데이터 매핑
    return attendances.map((attendance) => ({
      userName: attendance.user.userName,
      score: attendance.score,
      wakeTime: attendance.challenge.wakeTime,
    }));
  }

  async setWakeTime(setChallengeWakeTimeDto): Promise<void> {
    const challengeValue = await this.challengeRepository.findOne({
      where: { _id: setChallengeWakeTimeDto.challengeId },
    });
    if (!challengeValue) {
      throw new NotFoundException(
        `Challenge with ID ${setChallengeWakeTimeDto.challengeId} not found`,
      );
    }
    console.log('@@@@@@@@@@@@@@@@@@@@', setChallengeWakeTimeDto);
    challengeValue.wakeTime = new Date(
      `1970-01-01T${setChallengeWakeTimeDto.wakeTime}`,
    );
    await this.challengeRepository.save(challengeValue);

    const cacheKey = `challenge_${setChallengeWakeTimeDto.challengeId}`;
    await this.redisCacheService.del(cacheKey);
  }

  // 날짜 비교해서 챌린지 끝난경우 호출되는 메소드
  async completeChallenge(challengeId: number, userId: number): Promise<void> {
    if (!this.endChallenge(challengeId)) {
      // 챌린지 시간 비교해서 아직 끝나지 않았다면 return 처리 해야함
      // -> error를 발생시켜야 하나?
      return;
    }
    await this.userService.resetChallenge(userId); // 2.user 챌린지 정보를 -1로 변경
    const challenge = await this.challengeRepository.findOne({
      where: { _id: challengeId },
    });
    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${challengeId} not found`);
    }
    // 1. 호스트인지 체크 후 호스트 인경우 챌린지 expired로 변경 -> 챌린지 정보를 가져와야 알 수 있음 userID 랑 비교
    if (challenge.hostId === userId) {
      challenge.expired = true;
      await this.challengeRepository.save(challenge);
    }

    // 3. 메달처리
    // 기간별로 90%이상 80점 이상 달성시 메달 획득 금 100 은 30 동 7
    const cutLine = await this.attendanceRepository.find({
      where: { challengeId, userId, score: MoreThan(80) },
    });
    const total = challenge.duration;

    if (cutLine.length >= total * 0.9) {
      // cutLine/total >= 0.9
      await this.userService.updateUserMedals(
        userId,
        this.userService.decideMedalType(total),
      );
    }
  }
}
