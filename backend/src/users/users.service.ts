import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminExists = await this.usersRepository.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const admin = this.usersRepository.create({
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      const savedAdmin = await this.usersRepository.save(admin);
      savedAdmin.created_by = savedAdmin.id;
      savedAdmin.updated_by = savedAdmin.id;
      await this.usersRepository.save(savedAdmin);
      console.log('Admin user created with username: admin, password: admin');
    }
  }

  async create(email: string, username: string, password: string, role: UserRole = UserRole.STAFF): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.usersRepository.save(user);
    savedUser.created_by = savedUser.id;
    savedUser.updated_by = savedUser.id;
    return this.usersRepository.save(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ where: { role: UserRole.STAFF } });
  }

  async createStaff(email: string, username: string, createdBy: number): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash('admin', 10);
    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      role: UserRole.STAFF,
    });

    const savedUser = await this.usersRepository.save(user);
    savedUser.created_by = createdBy;
    savedUser.updated_by = createdBy;
    return this.usersRepository.save(savedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    await this.usersRepository.remove(user);
  }
}