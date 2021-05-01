export default interface IConverter<T> {
    convert(object: any): T
}