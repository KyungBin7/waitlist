import { Controller, Get } from '@nestjs/common';
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
}