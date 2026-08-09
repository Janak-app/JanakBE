import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCompanyProfileDto } from './dto/company-profile.dto';
import { CompanyProfile } from './entities/company-profile.entity';

@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectRepository(CompanyProfile)
    private profileRepository: Repository<CompanyProfile>,
    private configService: ConfigService,
  ) {}

  private buildFileUrl(filename: string): string {
    const baseUrl = this.configService.get<string>('APP_URL', 'http://localhost:3001');
    return `${baseUrl}/uploads/company-docs/${filename}`;
  }

  async upsert(
    user: User,
    dto: CreateCompanyProfileDto,
    files: { panCardFile?: Express.Multer.File[]; gstCertificateFile?: Express.Multer.File[] },
  ) {
    let profile = await this.profileRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!profile) {
      profile = this.profileRepository.create({ user });
    }

    profile.companyName = dto.companyName;
    profile.phone = dto.phone;
    profile.panNumber = dto.panNumber;
    profile.gstin = dto.gstin;

    if (files.panCardFile?.[0]) {
      profile.panCardFileUrl = this.buildFileUrl(files.panCardFile[0].filename);
    }

    if (files.gstCertificateFile?.[0]) {
      profile.gstCertificateFileUrl = this.buildFileUrl(files.gstCertificateFile[0].filename);
    }

    return this.profileRepository.save(profile);
  }

  async findByUser(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) throw new NotFoundException('Company profile not found');
    return profile;
  }
}
