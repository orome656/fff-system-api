import { Field } from "../models/Field";
import IConverter from "./IConverter";

class FieldConverter implements IConverter<Field> {
    convert(object: any): Field {
        return {
            adresse: object.address
        }
    }

}

export default new FieldConverter()