import * as pose from '@mediapipe/pose';

// 자세 배열 및 현재 자세
export const POSES = [
  {
    name: 'leftStretch', // 왼쪽으로 양팔을 뻗고 스트레칭
    keypoints: [
      pose.POSE_LANDMARKS.LEFT_SHOULDER,
      pose.POSE_LANDMARKS.LEFT_ELBOW,
      pose.POSE_LANDMARKS.LEFT_WRIST,
      pose.POSE_LANDMARKS.RIGHT_SHOULDER,
      pose.POSE_LANDMARKS.RIGHT_ELBOW,
      pose.POSE_LANDMARKS.RIGHT_WRIST,
    ],
    condition: keypoints =>
      keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].y <
        keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y &&
      keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y <
        keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y &&
      keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].x <
        keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x &&
      keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x <
        keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].x &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].x <
        keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x &&
      keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x <
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].x &&
      keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y <
        keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y,
    score: 1,
  },
  // ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ 시연을 위해 rightStretch 주석 처리 ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
  // {
  //   name: 'rightStretch', // 오른쪽으로 양팔을 뻗고 스트레칭
  //   keypoints: [
  //     pose.POSE_LANDMARKS.LEFT_SHOULDER,
  //     pose.POSE_LANDMARKS.LEFT_ELBOW,
  //     pose.POSE_LANDMARKS.LEFT_WRIST,
  //     pose.POSE_LANDMARKS.RIGHT_SHOULDER,
  //     pose.POSE_LANDMARKS.RIGHT_ELBOW,
  //     pose.POSE_LANDMARKS.RIGHT_WRIST,
  //   ],
  //   condition: keypoints =>
  //     keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].y <
  //       keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y &&
  //     keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].y <
  //       keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y &&
  //     keypoints[pose.POSE_LANDMARKS.LEFT_WRIST].x >
  //       keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x &&
  //     keypoints[pose.POSE_LANDMARKS.LEFT_ELBOW].x >
  //       keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].x &&
  //     keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].y <
  //       keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y &&
  //     keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].y <
  //       keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y &&
  //     keypoints[pose.POSE_LANDMARKS.RIGHT_WRIST].x >
  //       keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x &&
  //     keypoints[pose.POSE_LANDMARKS.RIGHT_ELBOW].x >
  //       keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].x &&
  //     keypoints[pose.POSE_LANDMARKS.LEFT_SHOULDER].y >
  //       keypoints[pose.POSE_LANDMARKS.RIGHT_SHOULDER].y,
  //   score: 1,
  // },
  // 다른 자세들 추가 가능
];
