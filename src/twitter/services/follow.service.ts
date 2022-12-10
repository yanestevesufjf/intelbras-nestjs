import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FollowEntity } from '../entities/follow.entity';
import { JwtPayloadUser } from '../utils/jwt-payload-user';

@Injectable()
export class FollowService {
    constructor(
        @Inject('FOLLOW_REPOSITORY')
        private readonly followRepository: Repository<FollowEntity>
    ) { }

    /**
     * Ex: usuário A deseja começar a seguir usuário B     
     */
    follow(userPayload: JwtPayloadUser, followingId: number) {
        return new Promise<void>(async (resolve) => {
            await this.followRepository.insert({
                userId: userPayload.id,
                followingId: followingId
            })
            resolve()
        })
    }

    /**
     * Ex: usuário A deseja parar de seguir usuário B     
     */
    unfollow(userPayload: JwtPayloadUser, followingId: number) {
        return new Promise((resolve) => {
            this.followRepository.delete({
                userId: userPayload.id,
                followingId: followingId
            })
        })
    }

    /**
     * Ex: usuário A seguindo usuário B
     * E o usuário B deseja parar de ser seguido por usuário A     
     */
    removeFollower(userPayload: JwtPayloadUser, followingId: number) {
        return new Promise<void>(async (resolve) => {
            await this.followRepository.delete({
                followingId: userPayload.id,
                userId: followingId
            })
            resolve();
        })
    }

    async followingCount(id: number) {
        return (await this.followRepository.findAndCount({
            where: {
                userId: id
            }
        }))[1]
    }

    async followersCount(id: number) {
        return (await this.followRepository.findAndCount({
            where: {
                followingId: id
            }
        }))[1]   
    }
}