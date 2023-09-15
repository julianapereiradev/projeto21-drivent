import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError } from '@/errors';
import { addressRepository, CreateAddressParams, enrollmentRepository, CreateEnrollmentParams } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';

 type CepFormatado = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
}

async function validatingZipCode(cep: string) {
  const regexCep = /^\d{8}$/
  if(!regexCep.test(cep)) throw invalidDataError('This zip code is invalid')

  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);
  if(!result.data || result.data.erro) throw invalidDataError('This zip code does not exist')
  return result.data
}


async function getAddressFromCEP(cep: string) {
  
const result = await validatingZipCode(cep)
//console.log("resultado em getAddressFromCep", result)  

  const cepFormato: CepFormatado  = {
    logradouro: result.logradouro,
    complemento: result.complemento,
    bairro: result.bairro,
    cidade:  result.localidade,
    uf: result.uf,
  }
  // TODO: Tratar regras de negócio e lanças eventuais erros

  // FIXME: não estamos interessados em todos os campos
   return cepFormato;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw invalidDataError("Address doesn't exist!");

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  enrollment.birthday = new Date(enrollment.birthday);
  const address = getAddressForUpsert(params.address);

  // TODO - Verificar se o CEP é válido antes de associar ao enrollment.
  await validatingZipCode(address.cep)
  console.log('address aqui:', address)

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

export const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};
