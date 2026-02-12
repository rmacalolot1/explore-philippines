
-- Create festivals table
CREATE TABLE public.festivals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  province TEXT NOT NULL,
  region TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  image_url TEXT,
  category TEXT DEFAULT 'festival',
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.festivals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Festivals are viewable by everyone"
ON public.festivals FOR SELECT
USING (true);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Seed festivals data
INSERT INTO public.festivals (name, description, location, province, region, start_date, end_date, image_url, category, highlights) VALUES
('Sinulog Festival', 'One of the grandest festivals in the Philippines, celebrating the Santo Niño with a vibrant street parade featuring colorful costumes and rhythmic drumbeats.', 'Cebu City', 'Cebu', 'Central Visayas', '2026-01-18', '2026-01-19', 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800', 'religious', ARRAY['Street Dancing', 'Fluvial Procession', 'Drum & Bugle Corps']),
('Ati-Atihan Festival', 'Known as the "Mother of All Philippine Festivals," this colorful celebration honors the Santo Niño with tribal dances and face painting.', 'Kalibo', 'Aklan', 'Western Visayas', '2026-01-11', '2026-01-18', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 'religious', ARRAY['Tribal Dancing', 'Face Painting', 'Street Party']),
('Pahiyas Festival', 'A harvest thanksgiving festival where houses are decorated with colorful rice wafers (kiping), fruits, and vegetables in a spectacular display.', 'Lucban', 'Quezon', 'CALABARZON', '2026-05-15', '2026-05-15', 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800', 'harvest', ARRAY['Kiping Decorations', 'House Decorating Contest', 'Street Food']),
('MassKara Festival', 'The "Festival of Smiles" features street dancers wearing elaborate smiling masks, celebrating resilience and positivity in Bacolod City.', 'Bacolod City', 'Negros Occidental', 'Western Visayas', '2026-10-18', '2026-10-25', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'cultural', ARRAY['Mask Making', 'Electric MassKara', 'Street Dancing']),
('Panagbenga Festival', 'The Flower Festival of Baguio City showcases stunning float parades adorned with fresh flowers and street dancing along Session Road.', 'Baguio City', 'Benguet', 'Cordillera', '2026-02-01', '2026-03-08', 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800', 'cultural', ARRAY['Float Parade', 'Street Dancing', 'Market Encounter']),
('Kadayawan Festival', 'Davao City''s week-long thanksgiving festival celebrates the city''s bountiful harvest, diverse culture, and vibrant indigenous heritage.', 'Davao City', 'Davao del Sur', 'Davao Region', '2026-08-16', '2026-08-23', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 'harvest', ARRAY['Indak-Indak sa Kadalanan', 'Floral Float Parade', 'Tribal Exhibition']),
('Dinagyang Festival', 'A religious and cultural festival in Iloilo City featuring warrior-like street dancing in honor of the Santo Niño and the Malay settlers.', 'Iloilo City', 'Iloilo', 'Western Visayas', '2026-01-25', '2026-01-25', 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800', 'religious', ARRAY['Ati Tribe Dancing', 'Kasadyahan', 'Religious Procession']),
('Pintados-Kasadyahan Festival', 'Celebrates the ancient tradition of tattooing in the Visayas with elaborate body painting and vibrant cultural performances.', 'Tacloban City', 'Leyte', 'Eastern Visayas', '2026-06-29', '2026-06-29', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'cultural', ARRAY['Body Painting', 'Cultural Dance', 'Historical Reenactment']),
('Lanzones Festival', 'Celebrates the bountiful harvest of lanzones fruit in Camiguin with street dancing, parades, and agricultural trade fairs.', 'Mambajao', 'Camiguin', 'Northern Mindanao', '2026-10-24', '2026-10-28', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', 'harvest', ARRAY['Street Dancing', 'Agri Fair', 'Beauty Pageant']),
('Higantes Festival', 'Giant papier-mâché figures (higantes) are paraded through the streets of Angono in this unique and whimsical celebration.', 'Angono', 'Rizal', 'CALABARZON', '2026-11-23', '2026-11-23', 'https://images.unsplash.com/photo-1472457897821-70d89e4264f1?w=800', 'cultural', ARRAY['Giant Puppet Parade', 'Art Exhibits', 'Cultural Shows']);
