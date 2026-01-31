-- Create summoners table
CREATE TABLE IF NOT EXISTS summoners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puuid TEXT UNIQUE NOT NULL,
  game_name TEXT NOT NULL,
  tag_line TEXT NOT NULL,
  summoner_id TEXT,
  summoner_level INTEGER,
  profile_icon_id INTEGER,
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  match_id TEXT PRIMARY KEY,
  game_creation BIGINT NOT NULL,
  game_duration INTEGER NOT NULL,
  game_mode TEXT NOT NULL,
  game_version TEXT NOT NULL,
  queue_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create match_participants table
CREATE TABLE IF NOT EXISTS match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT NOT NULL REFERENCES matches(match_id),
  puuid TEXT NOT NULL,
  champion_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  kills INTEGER NOT NULL,
  deaths INTEGER NOT NULL,
  assists INTEGER NOT NULL,
  total_minions_killed INTEGER NOT NULL,
  gold_earned INTEGER NOT NULL,
  win BOOLEAN NOT NULL,
  items JSONB,
  summoner_spells JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(match_id, puuid)
);

-- Create champion_stats table for tier lists
CREATE TABLE IF NOT EXISTS champion_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  champion_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  tier TEXT NOT NULL,
  win_rate DECIMAL(5,2) NOT NULL,
  pick_rate DECIMAL(5,2) NOT NULL,
  ban_rate DECIMAL(5,2) NOT NULL,
  games_played INTEGER NOT NULL,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(champion_id, role)
);

-- Create indexes for better query performance
CREATE INDEX idx_summoners_puuid ON summoners(puuid);
CREATE INDEX idx_summoners_game_name_tag ON summoners(game_name, tag_line);
CREATE INDEX idx_matches_game_creation ON matches(game_creation DESC);
CREATE INDEX idx_match_participants_puuid ON match_participants(puuid);
CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_champion_stats_role ON champion_stats(role);

-- Enable Row Level Security (optional, for future use)
ALTER TABLE summoners ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE champion_stats ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can make this more restrictive)
CREATE POLICY "Allow all operations on summoners" ON summoners FOR ALL USING (true);
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all operations on match_participants" ON match_participants FOR ALL USING (true);
CREATE POLICY "Allow all operations on champion_stats" ON champion_stats FOR ALL USING (true);
