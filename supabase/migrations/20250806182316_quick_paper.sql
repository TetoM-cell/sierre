/*
  # KPI Tracker Database Schema

  This migration creates the complete database schema for the KPI tracker application.

  ## New Tables
  1. **profiles** - User profile information
     - `user_id` (uuid, primary key) - References auth.users
     - `first_name` (text) - User's first name
     - `last_name` (text) - User's last name
     - `email` (text, unique) - User's email address
     - `avatar_url` (text, optional) - Profile picture URL
     - `created_at` (timestamptz) - Account creation timestamp
     - `updated_at` (timestamptz) - Last profile update timestamp

  2. **integrations** - Platform integrations for data sync
     - `id` (uuid, primary key) - Unique integration identifier
     - `user_id` (uuid) - References profiles.user_id
     - `platform` (text) - Platform name (shopify, etsy, woocommerce, squarespace)
     - `status` (text) - Connection status (connected, disconnected, error)
     - `api_key` (text, encrypted) - Encrypted API credentials
     - `store_name` (text) - Store/shop name
     - `sync_frequency` (text) - How often to sync (realtime, hourly, daily, weekly)
     - `last_sync` (timestamptz, optional) - Last successful sync timestamp
     - `created_at` (timestamptz) - Integration creation timestamp

  3. **kpi_data** - KPI metrics and values
     - `id` (uuid, primary key) - Unique KPI record identifier
     - `user_id` (uuid) - References profiles.user_id
     - `metric_name` (text) - Name of the KPI metric
     - `value` (decimal) - Current metric value
     - `target` (decimal) - Target value for the metric
     - `unit` (text) - Unit type (currency, percentage, count, ratio)
     - `category` (text) - KPI category for organization
     - `change_percent` (decimal) - Percentage change from previous period
     - `trend` (text) - Trend direction (up, down, neutral)
     - `recorded_at` (timestamptz) - When the metric was recorded

  4. **sync_logs** - Integration sync history and error tracking
     - `id` (uuid, primary key) - Unique log entry identifier
     - `user_id` (uuid) - References profiles.user_id
     - `integration_id` (uuid) - References integrations.id
     - `status` (text) - Sync status (success, error, in_progress)
     - `error_message` (text, optional) - Error details if sync failed
     - `synced_at` (timestamptz) - Sync attempt timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Proper foreign key constraints
  - Encrypted sensitive data storage

  ## Performance
  - Optimized indexes for common queries
  - Efficient user isolation
  - Real-time subscription support
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('shopify', 'etsy', 'woocommerce', 'squarespace')),
  status text NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  api_key text, -- Will be encrypted at application level
  store_name text NOT NULL,
  sync_frequency text NOT NULL DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
  last_sync timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create kpi_data table
CREATE TABLE IF NOT EXISTS kpi_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  value decimal NOT NULL,
  target decimal NOT NULL,
  unit text NOT NULL CHECK (unit IN ('currency', 'percentage', 'count', 'ratio')),
  category text NOT NULL,
  change_percent decimal DEFAULT 0,
  trend text DEFAULT 'neutral' CHECK (trend IN ('up', 'down', 'neutral')),
  recorded_at timestamptz DEFAULT now() NOT NULL
);

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  integration_id uuid NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('success', 'error', 'in_progress')),
  error_message text,
  synced_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for integrations
CREATE POLICY "Users can read own integrations"
  ON integrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integrations"
  ON integrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations"
  ON integrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations"
  ON integrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for kpi_data
CREATE POLICY "Users can read own KPI data"
  ON kpi_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KPI data"
  ON kpi_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own KPI data"
  ON kpi_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own KPI data"
  ON kpi_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for sync_logs
CREATE POLICY "Users can read own sync logs"
  ON sync_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync logs"
  ON sync_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_platform ON integrations(platform);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);
CREATE INDEX IF NOT EXISTS idx_integrations_last_sync ON integrations(last_sync);

CREATE INDEX IF NOT EXISTS idx_kpi_data_user_id ON kpi_data(user_id);
CREATE INDEX IF NOT EXISTS idx_kpi_data_metric_name ON kpi_data(metric_name);
CREATE INDEX IF NOT EXISTS idx_kpi_data_category ON kpi_data(category);
CREATE INDEX IF NOT EXISTS idx_kpi_data_recorded_at ON kpi_data(recorded_at);
CREATE INDEX IF NOT EXISTS idx_kpi_data_user_recorded ON kpi_data(user_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_integration_id ON sync_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON sync_logs(synced_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable real-time subscriptions for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE integrations;
ALTER PUBLICATION supabase_realtime ADD TABLE kpi_data;
ALTER PUBLICATION supabase_realtime ADD TABLE sync_logs;