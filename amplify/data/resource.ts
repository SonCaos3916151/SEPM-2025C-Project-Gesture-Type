import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // 1. USER MANAGEMENT
  // Links to the Cognito User. 'owner' auth means only the user can see/edit their own profile.
  UserProfile: a.model({
    email: a.email(),
    displayName: a.string(),
    dataConsent: a.boolean(),
    lastLogin: a.datetime(),
    
    // Relationships
    settings: a.hasOne('UserSettings', 'profileId'), // 1:1 Relationship
    progress: a.hasMany('UserProgress', 'profileId'),
    sessions: a.hasMany('GameSession', 'profileId'),
  }).authorization((allow) => [allow.owner()]),

  UserSettings: a.model({
    profileId: a.id(),
    profile: a.belongsTo('UserProfile', 'profileId'),
    
    theme: a.string().default('light'), // 'light' or 'dark'
    fontSize: a.string().default('medium'),
    audioEnabled: a.boolean().default(true),
    targetDifficulty: a.integer().default(1),
  }).authorization((allow) => [allow.owner()]),

  // 2. SHORTHAND CONTENT (Static Data)
  // 'publicApiKey' means anyone can read these (needed for the game to load symbols).
  // Admin-only write permissions would be added here in a real production app.
  ShorthandSystem: a.model({
    name: a.string().required(), // e.g., "Gregg"
    description: a.string(),
    
    symbols: a.hasMany('Symbol', 'systemId'),
  }).authorization((allow) => [allow.publicApiKey()]),

  Symbol: a.model({
    systemId: a.id(),
    system: a.belongsTo('ShorthandSystem', 'systemId'),
    
    label: a.string().required(), // e.g., "k-curve"
    canonicalStrokeData: a.json(), // Stores the ideal stroke coordinates
    difficultyTier: a.integer(),
    
    dictionaryEntries: a.hasMany('DictionaryEntry', 'symbolId'),
  }).authorization((allow) => [allow.publicApiKey()]),

  DictionaryEntry: a.model({
    symbolId: a.id(),
    symbol: a.belongsTo('Symbol', 'symbolId'),
    
    englishTranslation: a.string().required(),
    frequencyWeight: a.float(),
  }).authorization((allow) => [allow.publicApiKey()]),

  // 3. GAMEPLAY & PROGRESSION
  GameLevel: a.model({
    levelOrder: a.integer().required(),
    unlockThreshold: a.integer(),
    spawnRate: a.float(),
    complexityRules: a.json(), // Defines which symbols appear
  }).authorization((allow) => [allow.publicApiKey()]),

  UserProgress: a.model({
    profileId: a.id(),
    profile: a.belongsTo('UserProfile', 'profileId'),
    
    levelId: a.id(), // We just store the ID for reference
    highScore: a.integer().default(0),
    isUnlocked: a.boolean().default(false),
  }).authorization((allow) => [allow.owner()]),

  GameSession: a.model({
    profileId: a.id(),
    profile: a.belongsTo('UserProfile', 'profileId'),
    
    mode: a.string(), // 'Arcade', 'Practice', 'Evaluation'
    startTime: a.datetime(),
    endTime: a.datetime(),
    finalScore: a.integer(),
    averageWpm: a.float(),
    accuracyRate: a.float(),
    
    logs: a.hasMany('GestureLog', 'sessionId'),
  }).authorization((allow) => [allow.owner()]),

  // 4. RESEARCH & ANALYTICS
  GestureLog: a.model({
    sessionId: a.id(),
    session: a.belongsTo('GameSession', 'sessionId'),
    
    targetSymbolId: a.string(),
    recognizedSymbolId: a.string(),
    isCorrect: a.boolean(),
    rawCoordinates: a.json(), // Critical for research
    latencyMs: a.integer(),
    inputMethod: a.string(), // 'Touch', 'Mouse'
  }).authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey', // Fallback
    // Ensure Cognito User Pools is enabled for owner auth
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
