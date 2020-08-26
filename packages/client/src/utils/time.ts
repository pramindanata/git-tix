function getSecondLabel(seconds: number): string {
  if (seconds > 1) {
    return 'seconds';
  }

  return 'second';
}

function getMinuteLabel(minutes: number): string {
  if (minutes > 1) {
    return 'minutes';
  }

  return 'minute';
}

export function getReadableTime(ms: number): string {
  const msPerSecond = 1000;
  const secondPerMinute = 60;
  const seconds = Math.floor(ms / msPerSecond);

  if (seconds > 60) {
    const minutes = Math.floor(seconds / secondPerMinute);
    const secondLeft = seconds - minutes * secondPerMinute;

    return `${minutes} ${getMinuteLabel(
      minutes,
    )} ${secondLeft} ${getSecondLabel(secondLeft)}`;
  }

  return `${seconds} ${getSecondLabel(seconds)}`;
}
