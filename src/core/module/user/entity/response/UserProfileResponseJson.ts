export interface UserProfileResponseJson {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  description: string;
  socials: Social[];
  alias_name: string;
  role: string;
  avatar: string;
  background: string;
  created_at: Date;
  updated_at: Date;
}
