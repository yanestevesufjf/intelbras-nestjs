import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AtualizaUsuarioDTO } from '../dto/atualiza-usuario.dto';
import { CreateUserDTO } from '../dto/create-user-dto';
import { FindOneUserDTO } from '../dto/find-one-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsuariosService {

    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<UserEntity>
    ) { }

    async findAll(): Promise<UserEntity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                /*
                - SQL: SELECT * FROM "users"                                
                - resposta:
                    [UserEntity] ou []
                */
                resolve(await this.userRepository.find());
                resolve(null)
            } catch (error) {
                reject(error)
            }
        })
    }

    async findOne(param: FindOneUserDTO): Promise<UserEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                /*                
                - SQL: SELECT * FROM "users" WHERE "id" = x
                - resposta:
                    UserEntity{} ou vazio
                */
                const found = await this.userRepository.findOne({
                    where: param
                })
                resolve(found)
            } catch (error) {
                reject(error)
            }
        })
    }

    // async insert(usuario: CreateUserDTO): Promise<UserEntity> {
        // return new Promise(async (resolve, reject) => {
        //     try {
        //         /*
        //         - SQL: INSERT INTO "users" VALUES usuario
        //         - resposta:
        //             InsertResult {
        //                 identifiers: [ 
        //                     { id: 7 } 
        //                 ],
        //                 generatedMaps: [ 
        //                     { id: 7 } // o id indica qual ?? o novo PK vinculado ao usu??rio adicionado.
        //                 ],
        //                 raw: [ 
        //                     { id: 7 } 
        //                 ]
        //             }
        //         */
        //         const response = await this.userRepository.insert(usuario)
        //         console.log('-insert response-')
        //         console.log(response)
        //         const { id } = (response).generatedMaps[0];
        //         let created = new UserEntity();
        //         created = { ...usuario, id: id }
        //         resolve(created);
        //         resolve(null)
        //     } catch (error: any) {
        //         reject({
        //             code: error.code,
        //             detail: error.detail
        //         })
        //     }
        // })
    // }

    async delete(param: FindOneUserDTO): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                /*
               - SQL: DELETE FROM "users" WHERE id = x
               - resposta:
                  DeleteResult {
                        { 
                            raw: [], 
                            affected: 1 // indica se algum dado foi afetado com a opera????o, ser?? 0 quando n??o remover.
                        }
                   }
               */
                const response = await this.userRepository.delete({ id: param.id })
                console.log('-delete response-')
                console.log(response)
                // verifico se alguma linha foi afetada ap??s o delete.
                const { affected } = response;

                // se linha alguma foi afetada significa que n??o foi realizado o delete.
                if (affected === 0) {
                    reject({
                        code: 20000,
                        detail: 'Este ID n??o est?? presente no banco de dados ou n??o foi poss??vel remover.'
                    })
                }
                resolve(true)
            } catch (error) {
                reject({
                    code: error.code,
                    detail: error.detail
                })
            }
        })
    }

    async update(param: FindOneUserDTO, usuario: AtualizaUsuarioDTO): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                /*
                - SQL: 
                - resposta:
                    UpdateResult {
                        "generatedMaps": [],
                        "raw": [],
                        "affected": 1
                    }                 
                 */
                const response = await this.userRepository.update({ id: param.id }, usuario)
                console.log('-- response update --')
                console.log(response)
                // verifico se alguma linha foi afetada ap??s o update.
                const { affected } = response;
                if (affected === 0) {
                    reject({
                        code: 20000,
                        detail: 'Este ID n??o est?? presente no banco de dados ou n??o foi poss??vel atualizar.'
                    })
                }
                resolve(true)
            } catch (error) {
                reject({
                    code: error.code,
                    detail: error.detail
                })
            }
        })
    }
}
