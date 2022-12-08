import * as bcrypt from 'bcrypt'
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/twitter/entities/user.entity';
import { CreateUserDto } from 'src/twitter/dto/create-user.dto';
import { CredentialsDTO } from 'src/twitter/dto/credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<UserEntity>
    ) { }

    signUp(user: CreateUserDto): Promise<UserEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const { name, email, password } = user;
                const userToCreate = this.userRepository.create()
                userToCreate.nome = name
                userToCreate.email = email
                userToCreate.ativo = true
                userToCreate.salt = await bcrypt.genSalt()
                userToCreate.password = await bcrypt.hash(password, userToCreate.salt)
                this.userRepository.save(userToCreate)
                delete userToCreate.password
                delete userToCreate.salt
                resolve(userToCreate)
            } catch (error) {
                reject(error)
            }

        })
    }

    async checkCredentials(credentials: CredentialsDTO) {
        const { email, password } = credentials;
        const user = await this.userRepository.findOne({
            where: {
                email: email,
                ativo: true
            }
        })

        if (user && (await user.checkPassword(password))) {
            return user;
        }
        return null;
    }
}