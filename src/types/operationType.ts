export interface OperationType<T> {
    status: boolean;
    message: string;
    data: T;
}
