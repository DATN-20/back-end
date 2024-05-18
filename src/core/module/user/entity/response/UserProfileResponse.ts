import { User } from '../User';
import { UserProfileResponseJson } from './UserProfileResponseJson';
import { UserResponseJson } from './UserResponseJson';

export class UserProfileResponse {
  private id: number;
  private firstName: string;
  private lastName: string;
  private aliasName: string;
  private phone: string;
  private address: string;
  private description: string;
  private socials: Social[];
  private role: string;
  private createdAt: Date;
  private updatedAt: Date;
  private avatar: string;
  private background: string;

  constructor(
    id: number,
    first_name: string,
    last_name: string,
    alias_name: string,
    phone: string,
    address: string,
    description: string,
    socials: Social[],
    role: string,
    created_at: Date,
    updated_at: Date,
    avatar: string,
    background: string,
  ) {
    this.id = id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.aliasName = alias_name;
    this.phone = phone;
    this.address = address;
    this.description = description;
    this.socials = socials;
    this.role = role;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.avatar = avatar;
    this.background = background;
  }

  public static convertFromEntity(user: User): UserProfileResponse {
    return new UserProfileResponse(
      user.id,
      user.firstName,
      user.lastName,
      user.aliasName,
      user.phone,
      user.address,
      user.description,
      user.socials,
      user.role,
      user.createdAt,
      user.updatedAt,
      user.avatar,
      user.background,
    );
  }

  public toJson(): UserProfileResponseJson {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      address: this.address,
      description: this.description,
      socials: this.socials,
      alias_name: this.aliasName,
      role: this.role,
      avatar: this.avatar,
      background: this.background,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toShortJson(): UserResponseJson {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      alias_name: this.aliasName,
      avatar: this.avatar,
    };
  }
}
