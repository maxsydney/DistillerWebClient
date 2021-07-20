// @generated by protobuf-ts 1.0.13 with parameters enable_angular_annotations,long_type_string
// @generated from protobuf file "DS18B20Messaging.proto" (syntax proto3)
// tslint:disable
import { BinaryWriteOptions } from "@protobuf-ts/runtime";
import { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import { BinaryReadOptions } from "@protobuf-ts/runtime";
import { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message DS18B20Sensor
 */
export interface DS18B20Sensor {
    /**
     * @generated from protobuf field: DS18B20Role role = 1;
     */
    role: DS18B20Role;
    /**
     * @generated from protobuf field: bytes romCode = 2;
     */
    romCode: Uint8Array;
    /**
     * @generated from protobuf field: double calibLinear = 3;
     */
    calibLinear: number;
    /**
     * @generated from protobuf field: double calibOffset = 4;
     */
    calibOffset: number;
}
/**
 * @generated from protobuf enum DS18B20Role
 */
export enum DS18B20Role {
    /**
     * @generated from protobuf enum value: NONE = 0;
     */
    NONE = 0,
    /**
     * @generated from protobuf enum value: HEAD_TEMP = 1;
     */
    HEAD_TEMP = 1,
    /**
     * @generated from protobuf enum value: REFLUX_TEMP = 2;
     */
    REFLUX_TEMP = 2,
    /**
     * @generated from protobuf enum value: PRODUCT_TEMP = 3;
     */
    PRODUCT_TEMP = 3,
    /**
     * @generated from protobuf enum value: RADIATOR_TEMP = 4;
     */
    RADIATOR_TEMP = 4,
    /**
     * @generated from protobuf enum value: BOILER_TEMP = 5;
     */
    BOILER_TEMP = 5
}
/**
 * Type for protobuf message DS18B20Sensor
 */
class DS18B20Sensor$Type extends MessageType<DS18B20Sensor> {
    constructor() {
        super("DS18B20Sensor", [
            { no: 1, name: "role", kind: "enum", T: () => ["DS18B20Role", DS18B20Role] },
            { no: 2, name: "romCode", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 3, name: "calibLinear", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 4, name: "calibOffset", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<DS18B20Sensor>): DS18B20Sensor {
        const message = { role: 0, romCode: new Uint8Array(0), calibLinear: 0, calibOffset: 0 };
        if (value !== undefined)
            reflectionMergePartial<DS18B20Sensor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DS18B20Sensor): DS18B20Sensor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* DS18B20Role role */ 1:
                    message.role = reader.int32();
                    break;
                case /* bytes romCode */ 2:
                    message.romCode = reader.bytes();
                    break;
                case /* double calibLinear */ 3:
                    message.calibLinear = reader.double();
                    break;
                case /* double calibOffset */ 4:
                    message.calibOffset = reader.double();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: DS18B20Sensor, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* DS18B20Role role = 1; */
        if (message.role !== 0)
            writer.tag(1, WireType.Varint).int32(message.role);
        /* bytes romCode = 2; */
        if (message.romCode.length)
            writer.tag(2, WireType.LengthDelimited).bytes(message.romCode);
        /* double calibLinear = 3; */
        if (message.calibLinear !== 0)
            writer.tag(3, WireType.Bit64).double(message.calibLinear);
        /* double calibOffset = 4; */
        if (message.calibOffset !== 0)
            writer.tag(4, WireType.Bit64).double(message.calibOffset);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const DS18B20Sensor = new DS18B20Sensor$Type();