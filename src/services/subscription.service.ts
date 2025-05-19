import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDto } from 'src/dto/create-subscription.dto';
import { Subscription } from 'src/entities/subscription.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class SubscriptionService {
  constructor(
		@InjectRepository(Subscription)
		private subscriptionRepository: Repository<Subscription>,
	) {}

  public async subscribe(subscriptionDto: CreateSubscriptionDto): Promise<{ success: boolean }> {
		const existingSubscription = await this.subscriptionRepository.findOne({
			where: {
				email: subscriptionDto.email
			}
		});

		if (existingSubscription) throw new ConflictException('Email already subscribed');

		const payload = {
			...subscriptionDto,
			confirmationToken: v4()
		}

		const subscription = await this.subscriptionRepository.save(payload);

		console.log('subscription', subscription);

		return { success: true };
  }
}
