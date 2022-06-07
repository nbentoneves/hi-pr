
module.exports = {
    disableEmoji: false,
    format: '{type}{scope}: {emoji}{subject}',
    list: ['test', 'feat', 'fix', 'chore', 'docs', 'ci', 'release'],
    maxMessageLength: 64,
    minMessageLength: 3,
    questions: ['type', 'scope', 'subject', 'body'],
    scopes: [],
    types: {
        chore: {
            description: 'Build process or auxiliary tool changes',
            emoji: '🤖',
            value: 'chore',
        },
        ci: {
            description: 'CI related changes',
            emoji: '🎡',
            value: 'ci',
        },
        docs: {
            description: 'Documentation only changes',
            emoji: '✏️',
            value: 'docs',
        },
        feat: {
            description: 'A new feature or improvement',
            emoji: '🎸',
            value: 'feat',
        },
        fix: {
            description: 'A bug fix',
            emoji: '🐛',
            value: 'fix',
        },
        release: {
            description: 'Create a release commit',
            emoji: '🏹',
            value: 'release',
        },
        test: {
            description: 'Adding missing tests',
            emoji: '💍',
            value: 'test',
        },
    },
};