import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateCompanyProfileDto {
  @ApiProperty({ example: 'Janak Positioning Systems Pvt Ltd' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: '9999999999' })
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone must be a 10-digit number' })
  phone: string;

  @ApiProperty({ example: 'ABCDE1234F' })
  @IsString()
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN number format' })
  panNumber: string;

  @ApiProperty({ example: '22ABCDE1234F1Z5' })
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: 'Invalid GSTIN format',
  })
  gstin: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'PAN card image/PDF' })
  panCardFile?: Express.Multer.File;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'GST certificate image/PDF' })
  gstCertificateFile?: Express.Multer.File;
}
