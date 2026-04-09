export const mockSiteConfig = {
  nextMeetingISO: new Date().toISOString(),
  featuredSubmissionId: 'mock-1',
  hallOfFameOpen: true,
};

export const mockSubmissions = [
  {
    id: 'mock-1',
    title: 'Classic clean stand-up bit',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    submitterName: 'Club Officer',
    notes: 'Great timing and callback structure.',
    tags: ['stand-up', 'timing'],
    analysis: 'Notice setup-payoff rhythm and escalating absurdity.',
    approved: true,
    featured: true,
    viewCount: 8,
    createdAt: new Date(),
  },
];

export const mockVotes = {
  'mock-1': 5,
};
