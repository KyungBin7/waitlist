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

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
