
INSERT INTO storage.buckets (id, name, public) VALUES ('festival-images', 'festival-images', true);

CREATE POLICY "Festival images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'festival-images');

CREATE POLICY "Allow public upload to festival-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'festival-images');
