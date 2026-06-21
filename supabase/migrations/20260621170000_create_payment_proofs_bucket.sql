-- Create bucket for payment proofs
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

-- Create policy to allow anyone to upload files to the payment-proofs bucket
create policy "Allow public uploads to payment-proofs"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'payment-proofs');

-- Create policy to allow public to view files from the payment-proofs bucket
create policy "Allow public read of payment-proofs"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'payment-proofs');
