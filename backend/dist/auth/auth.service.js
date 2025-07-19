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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const ethers_1 = require("ethers");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateWalletSignature(walletAddress, signature, message) {
        try {
            const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
            return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
        }
        catch (error) {
            return false;
        }
    }
    async login(walletAddress, signature, message) {
        const isValidSignature = await this.validateWalletSignature(walletAddress, signature, message);
        if (!isValidSignature) {
            throw new common_1.UnauthorizedException('Invalid wallet signature');
        }
        let user;
        try {
            user = await this.usersService.findByWalletAddress(walletAddress);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('User not found. Please register first.');
        }
        await this.usersService.updateLastLogin(user._id);
        const payload = {
            sub: user._id,
            walletAddress: user.walletAddress,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isVerified: user.isVerified,
            },
        };
    }
    async register(createUserDto, signature, message) {
        const isValidSignature = await this.validateWalletSignature(createUserDto.walletAddress, signature, message);
        if (!isValidSignature) {
            throw new common_1.UnauthorizedException('Invalid wallet signature');
        }
        const user = await this.usersService.create(createUserDto);
        const payload = {
            sub: user._id,
            walletAddress: user.walletAddress,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isVerified: user.isVerified,
            },
        };
    }
    async validateUser(payload) {
        return this.usersService.findOne(payload.sub);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map