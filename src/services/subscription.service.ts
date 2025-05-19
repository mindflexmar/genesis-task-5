import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDto } from 'src/dto/create-subscription.dto';
import { Subscription } from 'src/entities/subscription.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { NewMailerService } from './mailer-service';

@Injectable()
export class SubscriptionService {
  constructor(
		@InjectRepository(Subscription)
		private subscriptionRepository: Repository<Subscription>,
		@Inject(NewMailerService)
		private readonly mailerService: NewMailerService
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

		await this.mailerService.sendEmail(
			subscriptionDto.email,
			'Subscription Confirmation',
			`Please confirm your subscription by clicking the link: <a href="http://localhost:3000/confirm/${subscription.confirmationToken}">Confirm Subscription</a>`
		);

		return { success: true };
  }

  public async confirmSubscription(token: string): Promise<{ success: boolean }> {
		const subscription = await this.subscriptionRepository.findOne({
			where: {
				confirmationToken: token
			}
		});
		if (!subscription) throw new ConflictException('Invalid token');
		subscription.confirmed = true;

		await this.subscriptionRepository.save(subscription);
		return { success: true };
  }

  public async unsubscribe(token: string): Promise<{ success: boolean }> {
		const subscription = await this.subscriptionRepository.findOne({
			where: {
				confirmationToken: token
			}
		});
		if (!subscription) throw new ConflictException('Invalid token');
		await this.subscriptionRepository.delete(subscription.id);
		return { success: true };
  }
}
