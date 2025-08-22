import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('public/services')
export class PublicServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAllPublic() {
    const services = await this.servicesService.findAllPublic();

    return services.map((service) => ({
      id: (service._id as any).toString(),
      name: service.name,
      description: service.description,
      slug: service.slug,
      image: service.image,
      category: service.category,
      participantCount: (service as any).participantCount || 0,
    }));
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const service = await this.servicesService.findBySlug(slug);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Get actual participant count from database
    const participantCount = await this.servicesService.getParticipantCount(
      service._id as any,
    );

    return {
      id: (service._id as any).toString(),
      name: service.name,
      title: service.name,
      description: service.description,
      slug: service.slug,
      image: service.image,
      category: service.category,
      tagline: service.tagline,
      fullDescription: service.fullDescription,
      icon: service.icon,
      participantCount: participantCount,
      developer: service.developer,
      language: service.language,
      platform: service.platform,
      launchDate: service.launchDate,
      screenshots: service.screenshots || [],

      waitlistTitle: service.waitlistTitle,
      waitlistDescription: service.waitlistDescription,
    };
  }
}