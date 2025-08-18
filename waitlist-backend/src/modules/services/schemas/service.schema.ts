import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({
  timestamps: true,
  collection: 'services',
})
export class Service {
  @Prop({ type: Types.ObjectId, ref: 'Organizer', required: true, index: true })
  organizerId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop()
  waitlistTitle?: string;

  @Prop()
  waitlistDescription?: string;

  @Prop()
  waitlistBackground?: string;

  @Prop()
  image?: string;

  @Prop()
  category?: string;

  // New fields for service detail page
  @Prop()
  tagline?: string;

  @Prop()
  fullDescription?: string;

  @Prop()
  icon?: string;

  @Prop({ default: 0 })
  participantCount!: number;

  @Prop()
  developer?: string;

  @Prop()
  language?: string;

  @Prop()
  platform?: string;

  @Prop()
  launchDate?: string;

  @Prop({ type: [String], default: [] })
  screenshots!: string[];

  @Prop({ default: 0 })
  rating!: number;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
