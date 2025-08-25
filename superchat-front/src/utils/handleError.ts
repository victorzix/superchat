import {AxiosError} from "axios";

export function handleError(error: unknown | Error | AxiosError) {
  if (error instanceof AxiosError) {
    if (error.response?.data?.response?.message) {
      return error.response.data.response.message;
    }
  } else return 'Erro inesperado';
}