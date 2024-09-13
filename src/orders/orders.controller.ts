import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
  Request,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.ordersService.createOrder(
        req.user,
        createOrderDto,
      );
      return { message: 'Order created successfully', order };
    } catch (error) {
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the order',
      );
    }
  }

  @Get()
  async findAllOrders(@Request() req) {
    try {
      const orders = await this.ordersService.findAllByUser(req.user.id);
      return orders;
    } catch (error) {
      this.logger.error(
        `Failed to fetch orders: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching orders',
      );
    }
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    try {
      const order = await this.ordersService.findOne(+id, req.user.id);
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      this.logger.error(
        `Failed to fetch order ${id}: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while fetching the order',
      );
    }
  }
}
