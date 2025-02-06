// TODO: Make use lodash to simplify the code

export function filterChannel(
  videoData: any,
  channelId?: string
): [any[], any[], any[]] {
  const today: any[] = videoData?.day;
  const week: any[] = videoData?.week;
  const month: any[] = videoData?.month;

  if (!channelId) {
    return [today, week, month];
  }

  const filteredToday = today.filter((video) => video.channelId === channelId);
  const filteredWeek = week.filter((video) => video.channelId === channelId);
  const filteredMonth = month.filter((video) => video.channelId === channelId);

  return [filteredToday, filteredWeek, filteredMonth];
}

type ChannelTag = { title: string; id: string; logo: string };

function getChannels(videos: any[]) {
  const channels = [];
  for (let i = 0; i < videos?.length; i++) {
    const video = videos[i];
    const channel = {
      id: video.channelId,
      logo: video.channelLogo,
      title: video.channelTitle,
    };
    channels.push(channel);
  }

  return channels;
}

function channelUnique(channels: ChannelTag[]) {
  const uniqueChannels = [];
  const _trackhannelIds: string[] = [];

  for (let i = 0; i < channels?.length; i++) {
    const channel = channels[i];
    if (!_trackhannelIds.includes(channel.id)) {
      _trackhannelIds.push(channel.id);
      uniqueChannels.push(channel);
    }
  }
  return uniqueChannels;
}

export function getActiveChannelIds(videoData: any): ChannelTag[] {
  const channelIds: ChannelTag[] = [];

  const today: any[] = videoData?.day;
  const week: any[] = videoData?.week;
  const month: any[] = videoData?.month;

  channelIds.push(...getChannels(today));
  channelIds.push(...getChannels(week));
  channelIds.push(...getChannels(month));

  return channelUnique(channelIds);
}
