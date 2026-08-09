import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  findAll(userId: string) {
    return this.addressesRepository.find({ where: { user: { id: userId } } });
  }

  create(user: User, dto: CreateAddressDto) {
    const address = this.addressesRepository.create({ ...dto, user });
    return this.addressesRepository.save(address);
  }

  async update(id: string, userId: string, dto: Partial<CreateAddressDto>) {
    const address = await this.addressesRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!address) throw new NotFoundException('Address not found');
    Object.assign(address, dto);
    return this.addressesRepository.save(address);
  }

  async remove(id: string, userId: string) {
    const address = await this.addressesRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressesRepository.remove(address);
    return { message: 'Address deleted' };
  }
}
