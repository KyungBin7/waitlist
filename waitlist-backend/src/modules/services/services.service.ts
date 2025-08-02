import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import {
  WaitlistParticipant,
  WaitlistParticipantDocument,
} from '../participants/schemas/participant.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(WaitlistParticipant.name)
    private participantModel: Model<WaitlistParticipantDocument>,
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
    organizerId: string,
  ): Promise<ServiceDocument> {
    try {
      const service = new this.serviceModel({
        ...createServiceDto,
        organizerId: new Types.ObjectId(organizerId),
      });

      return await service.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('A service with this slug already exists');
      }
      throw error;
    }
  }

  async findAll(organizerId: string): Promise<ServiceDocument[]> {
    const services = await this.serviceModel
      .find({ organizerId: new Types.ObjectId(organizerId) })
      .sort({ createdAt: -1 })
      .exec();

    // Add participant count to each service
    const servicesWithCounts = await Promise.all(
      services.map(async (service) => {
        const participantCount = await this.getParticipantCount(
          service._id as Types.ObjectId,
        );
        return {
          ...service.toObject(),
          participantCount,
        };
      }),
    );

    return servicesWithCounts as any;
  }

  async findOne(id: string, organizerId: string): Promise<ServiceDocument> {
    const service = await this.serviceModel
      .findOne({
        _id: new Types.ObjectId(id),
        organizerId: new Types.ObjectId(organizerId),
      })
      .exec();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const participantCount = await this.getParticipantCount(
      service._id as Types.ObjectId,
    );

    return {
      ...service.toObject(),
      participantCount,
    } as any;
  }

  async findBySlug(slug: string): Promise<ServiceDocument | null> {
    return await this.serviceModel.findOne({ slug }).exec();
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    organizerId: string,
  ): Promise<ServiceDocument> {
    try {
      const service = await this.serviceModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(id),
            organizerId: new Types.ObjectId(organizerId),
          },
          { ...updateServiceDto, updatedAt: new Date() },
          { new: true },
        )
        .exec();

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      return service;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('A service with this slug already exists');
      }
      throw error;
    }
  }

  async remove(id: string, organizerId: string): Promise<void> {
    const result = await this.serviceModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        organizerId: new Types.ObjectId(organizerId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Service not found');
    }

    // Also remove all participants for this service
    await this.participantModel
      .deleteMany({ serviceId: new Types.ObjectId(id) })
      .exec();
  }

  async getParticipantCount(serviceId: Types.ObjectId): Promise<number> {
    return await this.participantModel.countDocuments({ serviceId }).exec();
  }

  async getServiceParticipants(
    serviceId: string,
    organizerId: string,
  ): Promise<WaitlistParticipantDocument[]> {
    // First verify the service belongs to the organizer
    const service = await this.serviceModel
      .findOne({
        _id: new Types.ObjectId(serviceId),
        organizerId: new Types.ObjectId(organizerId),
      })
      .exec();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return await this.participantModel
      .find({ serviceId: new Types.ObjectId(serviceId) })
      .sort({ joinDate: 1 })
      .exec();
  }
}
