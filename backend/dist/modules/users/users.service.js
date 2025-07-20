"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findAll(pagination) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async findByWalletAddress(walletAddress) {
        const user = await this.userRepository.findOne({
            where: { walletAddress }
        });
        return user;
    }
    async create(userData) {
        this.logger.log(`Creating user: ${userData.email}`);
        const existingUser = await this.findByWalletAddress(userData.walletAddress);
        if (existingUser) {
            return {
                success: true,
                user: existingUser,
                message: 'User already exists',
                isNewUser: false,
            };
        }
        const existingEmail = await this.userRepository.findOne({
            where: { email: userData.email }
        });
        if (existingEmail) {
            throw new Error('Email already registered');
        }
        const user = this.userRepository.create({
            ...userData,
            isActive: true,
            isVerified: false,
        });
        const savedUser = await this.userRepository.save(user);
        return {
            success: true,
            user: savedUser,
            message: 'User created successfully',
            isNewUser: true,
        };
    }
    async update(id, userData) {
        this.logger.log(`Updating user: ${id}`);
        const user = await this.findOne(id);
        const updatedUser = Object.assign(user, userData);
        const savedUser = await this.userRepository.save(updatedUser);
        return {
            success: true,
            user: savedUser,
            message: 'User updated successfully',
        };
    }
    async remove(id) {
        this.logger.log(`Deleting user: ${id}`);
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
        return {
            success: true,
            id,
            message: 'User deleted successfully',
        };
    }
    async getUserPolicies(userId) {
        return {
            userId,
            policies: [],
            total: 0,
        };
    }
    async getUserClaims(userId) {
        return {
            userId,
            claims: [],
            total: 0,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map