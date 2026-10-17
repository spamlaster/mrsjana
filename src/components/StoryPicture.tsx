import { storyIllustrations } from '../data/storyIllustrations'

export function StoryPicture({ storyId, page, cover = false }: { storyId: string; page: number; cover?: boolean }) {
  return <img
    className={cover ? 'story-cover' : 'story-picture'}
    src={`/images/stories/${storyId}-${page + 1}.jpg`}
    alt={cover ? '' : storyIllustrations[storyId][page]}
    loading={cover ? 'lazy' : 'eager'}
    decoding="async"
    width={720}
    height={720}
  />
}
