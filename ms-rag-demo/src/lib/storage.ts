import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export class Storage {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async uploadFile(bucket: string, path: string, file: Buffer, options?: { contentType?: string }): Promise<{ path: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType,
        upsert: true
      });

    if (error) throw error;
    return { path: data.path };
  }

  async getFile(bucket: string, path: string): Promise<Buffer> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) throw error;
    return Buffer.from(await data.arrayBuffer());
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}

const storage = new Storage();
export default storage;
