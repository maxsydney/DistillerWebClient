// @generated by protobuf-ts 1.0.13 with parameters enable_angular_annotations,long_type_string
// @generated from protobuf file "ControllerMessaging.proto" (syntax proto3)
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
 * @generated from protobuf message PumpSpeeds
 */
export interface PumpSpeeds {
    /**
     * @generated from protobuf field: double refluxPumpSpeed = 1;
     */
    refluxPumpSpeed: number;
    /**
     * @generated from protobuf field: double productPumpSpeed = 2;
     */
    productPumpSpeed: number;
}
/**
 * @generated from protobuf message ControllerSettings
 */
export interface ControllerSettings {
    /**
     * @generated from protobuf field: PumpMode refluxPumpMode = 1;
     */
    refluxPumpMode: PumpMode;
    /**
     * @generated from protobuf field: PumpMode productPumpMode = 2;
     */
    productPumpMode: PumpMode;
    /**
     * @generated from protobuf field: PumpSpeeds manualPumpSpeeds = 3;
     */
    manualPumpSpeeds?: PumpSpeeds;
}
/**
 * @generated from protobuf message ControllerState
 */
export interface ControllerState {
    /**
     * @generated from protobuf field: double propOutput = 1;
     */
    propOutput: number;
    /**
     * @generated from protobuf field: double integralOutput = 2;
     */
    integralOutput: number;
    /**
     * @generated from protobuf field: double derivOutput = 3;
     */
    derivOutput: number;
    /**
     * @generated from protobuf field: double totalOutput = 4;
     */
    totalOutput: number;
    /**
     * @generated from protobuf field: uint32 timeStamp = 5;
     */
    timeStamp: number;
}
/**
 * @generated from protobuf message ControllerTuning
 */
export interface ControllerTuning {
    /**
     * @generated from protobuf field: double setpoint = 1;
     */
    setpoint: number;
    /**
     * @generated from protobuf field: double PGain = 2 [json_name = "PGain"];
     */
    pGain: number;
    /**
     * @generated from protobuf field: double IGain = 3 [json_name = "IGain"];
     */
    iGain: number;
    /**
     * @generated from protobuf field: double DGain = 4 [json_name = "DGain"];
     */
    dGain: number;
    /**
     * @generated from protobuf field: double LPFsampleFreq = 5 [json_name = "LPFsampleFreq"];
     */
    lPFsampleFreq: number;
    /**
     * @generated from protobuf field: double LPFcutoffFreq = 6 [json_name = "LPFcutoffFreq"];
     */
    lPFcutoffFreq: number;
}
/**
 * @generated from protobuf message ControllerCommand
 */
export interface ControllerCommand {
    /**
     * @generated from protobuf field: ComponentState fanState = 1;
     */
    fanState: ComponentState;
    /**
     * @generated from protobuf field: double LPElementDutyCycle = 2 [json_name = "LPElementDutyCycle"];
     */
    lPElementDutyCycle: number;
    /**
     * @generated from protobuf field: double HPElementDutyCycle = 3 [json_name = "HPElementDutyCycle"];
     */
    hPElementDutyCycle: number;
}
/**
 * @generated from protobuf message ControllerDataRequest
 */
export interface ControllerDataRequest {
    /**
     * @generated from protobuf field: ControllerDataRequestType requestType = 1;
     */
    requestType: ControllerDataRequestType;
}
/**
 * @generated from protobuf enum ControllerDataRequestType
 */
export enum ControllerDataRequestType {
    /**
     * @generated from protobuf enum value: NONE = 0;
     */
    NONE = 0,
    /**
     * @generated from protobuf enum value: TUNING = 1;
     */
    TUNING = 1,
    /**
     * @generated from protobuf enum value: SETTINGS = 2;
     */
    SETTINGS = 2,
    /**
     * @generated from protobuf enum value: PERIPHERAL_STATE = 3;
     */
    PERIPHERAL_STATE = 3
}
/**
 * @generated from protobuf enum ComponentState
 */
export enum ComponentState {
    /**
     * @generated from protobuf enum value: STATE_UNKNOWN = 0;
     */
    STATE_UNKNOWN = 0,
    /**
     * @generated from protobuf enum value: OFF_STATE = 1;
     */
    OFF_STATE = 1,
    /**
     * @generated from protobuf enum value: ON_STATE = 2;
     */
    ON_STATE = 2
}
/**
 * @generated from protobuf enum PumpMode
 */
export enum PumpMode {
    /**
     * @generated from protobuf enum value: PUMP_MODE_UNKNOWN = 0;
     */
    PUMP_MODE_UNKNOWN = 0,
    /**
     * @generated from protobuf enum value: PUMP_OFF = 1;
     */
    PUMP_OFF = 1,
    /**
     * @generated from protobuf enum value: ACTIVE_CONTROL = 2;
     */
    ACTIVE_CONTROL = 2,
    /**
     * @generated from protobuf enum value: MANUAL_CONTROL = 3;
     */
    MANUAL_CONTROL = 3
}
/**
 * Type for protobuf message PumpSpeeds
 */
class PumpSpeeds$Type extends MessageType<PumpSpeeds> {
    constructor() {
        super("PumpSpeeds", [
            { no: 1, name: "refluxPumpSpeed", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "productPumpSpeed", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<PumpSpeeds>): PumpSpeeds {
        const message = { refluxPumpSpeed: 0, productPumpSpeed: 0 };
        if (value !== undefined)
            reflectionMergePartial<PumpSpeeds>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PumpSpeeds): PumpSpeeds {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* double refluxPumpSpeed */ 1:
                    message.refluxPumpSpeed = reader.double();
                    break;
                case /* double productPumpSpeed */ 2:
                    message.productPumpSpeed = reader.double();
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
    internalBinaryWrite(message: PumpSpeeds, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* double refluxPumpSpeed = 1; */
        if (message.refluxPumpSpeed !== 0)
            writer.tag(1, WireType.Bit64).double(message.refluxPumpSpeed);
        /* double productPumpSpeed = 2; */
        if (message.productPumpSpeed !== 0)
            writer.tag(2, WireType.Bit64).double(message.productPumpSpeed);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const PumpSpeeds = new PumpSpeeds$Type();
/**
 * Type for protobuf message ControllerSettings
 */
class ControllerSettings$Type extends MessageType<ControllerSettings> {
    constructor() {
        super("ControllerSettings", [
            { no: 1, name: "refluxPumpMode", kind: "enum", T: () => ["PumpMode", PumpMode] },
            { no: 2, name: "productPumpMode", kind: "enum", T: () => ["PumpMode", PumpMode] },
            { no: 3, name: "manualPumpSpeeds", kind: "message", T: () => PumpSpeeds }
        ]);
    }
    create(value?: PartialMessage<ControllerSettings>): ControllerSettings {
        const message = { refluxPumpMode: 0, productPumpMode: 0 };
        if (value !== undefined)
            reflectionMergePartial<ControllerSettings>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ControllerSettings): ControllerSettings {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* PumpMode refluxPumpMode */ 1:
                    message.refluxPumpMode = reader.int32();
                    break;
                case /* PumpMode productPumpMode */ 2:
                    message.productPumpMode = reader.int32();
                    break;
                case /* PumpSpeeds manualPumpSpeeds */ 3:
                    message.manualPumpSpeeds = PumpSpeeds.internalBinaryRead(reader, reader.uint32(), options, message.manualPumpSpeeds);
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
    internalBinaryWrite(message: ControllerSettings, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* PumpMode refluxPumpMode = 1; */
        if (message.refluxPumpMode !== 0)
            writer.tag(1, WireType.Varint).int32(message.refluxPumpMode);
        /* PumpMode productPumpMode = 2; */
        if (message.productPumpMode !== 0)
            writer.tag(2, WireType.Varint).int32(message.productPumpMode);
        /* PumpSpeeds manualPumpSpeeds = 3; */
        if (message.manualPumpSpeeds)
            PumpSpeeds.internalBinaryWrite(message.manualPumpSpeeds, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const ControllerSettings = new ControllerSettings$Type();
/**
 * Type for protobuf message ControllerState
 */
class ControllerState$Type extends MessageType<ControllerState> {
    constructor() {
        super("ControllerState", [
            { no: 1, name: "propOutput", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "integralOutput", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 3, name: "derivOutput", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 4, name: "totalOutput", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 5, name: "timeStamp", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value?: PartialMessage<ControllerState>): ControllerState {
        const message = { propOutput: 0, integralOutput: 0, derivOutput: 0, totalOutput: 0, timeStamp: 0 };
        if (value !== undefined)
            reflectionMergePartial<ControllerState>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ControllerState): ControllerState {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* double propOutput */ 1:
                    message.propOutput = reader.double();
                    break;
                case /* double integralOutput */ 2:
                    message.integralOutput = reader.double();
                    break;
                case /* double derivOutput */ 3:
                    message.derivOutput = reader.double();
                    break;
                case /* double totalOutput */ 4:
                    message.totalOutput = reader.double();
                    break;
                case /* uint32 timeStamp */ 5:
                    message.timeStamp = reader.uint32();
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
    internalBinaryWrite(message: ControllerState, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* double propOutput = 1; */
        if (message.propOutput !== 0)
            writer.tag(1, WireType.Bit64).double(message.propOutput);
        /* double integralOutput = 2; */
        if (message.integralOutput !== 0)
            writer.tag(2, WireType.Bit64).double(message.integralOutput);
        /* double derivOutput = 3; */
        if (message.derivOutput !== 0)
            writer.tag(3, WireType.Bit64).double(message.derivOutput);
        /* double totalOutput = 4; */
        if (message.totalOutput !== 0)
            writer.tag(4, WireType.Bit64).double(message.totalOutput);
        /* uint32 timeStamp = 5; */
        if (message.timeStamp !== 0)
            writer.tag(5, WireType.Varint).uint32(message.timeStamp);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const ControllerState = new ControllerState$Type();
/**
 * Type for protobuf message ControllerTuning
 */
class ControllerTuning$Type extends MessageType<ControllerTuning> {
    constructor() {
        super("ControllerTuning", [
            { no: 1, name: "setpoint", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "PGain", kind: "scalar", jsonName: "PGain", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 3, name: "IGain", kind: "scalar", jsonName: "IGain", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 4, name: "DGain", kind: "scalar", jsonName: "DGain", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 5, name: "LPFsampleFreq", kind: "scalar", jsonName: "LPFsampleFreq", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 6, name: "LPFcutoffFreq", kind: "scalar", jsonName: "LPFcutoffFreq", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<ControllerTuning>): ControllerTuning {
        const message = { setpoint: 0, pGain: 0, iGain: 0, dGain: 0, lPFsampleFreq: 0, lPFcutoffFreq: 0 };
        if (value !== undefined)
            reflectionMergePartial<ControllerTuning>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ControllerTuning): ControllerTuning {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* double setpoint */ 1:
                    message.setpoint = reader.double();
                    break;
                case /* double PGain = 2 [json_name = "PGain"];*/ 2:
                    message.pGain = reader.double();
                    break;
                case /* double IGain = 3 [json_name = "IGain"];*/ 3:
                    message.iGain = reader.double();
                    break;
                case /* double DGain = 4 [json_name = "DGain"];*/ 4:
                    message.dGain = reader.double();
                    break;
                case /* double LPFsampleFreq = 5 [json_name = "LPFsampleFreq"];*/ 5:
                    message.lPFsampleFreq = reader.double();
                    break;
                case /* double LPFcutoffFreq = 6 [json_name = "LPFcutoffFreq"];*/ 6:
                    message.lPFcutoffFreq = reader.double();
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
    internalBinaryWrite(message: ControllerTuning, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* double setpoint = 1; */
        if (message.setpoint !== 0)
            writer.tag(1, WireType.Bit64).double(message.setpoint);
        /* double PGain = 2 [json_name = "PGain"]; */
        if (message.pGain !== 0)
            writer.tag(2, WireType.Bit64).double(message.pGain);
        /* double IGain = 3 [json_name = "IGain"]; */
        if (message.iGain !== 0)
            writer.tag(3, WireType.Bit64).double(message.iGain);
        /* double DGain = 4 [json_name = "DGain"]; */
        if (message.dGain !== 0)
            writer.tag(4, WireType.Bit64).double(message.dGain);
        /* double LPFsampleFreq = 5 [json_name = "LPFsampleFreq"]; */
        if (message.lPFsampleFreq !== 0)
            writer.tag(5, WireType.Bit64).double(message.lPFsampleFreq);
        /* double LPFcutoffFreq = 6 [json_name = "LPFcutoffFreq"]; */
        if (message.lPFcutoffFreq !== 0)
            writer.tag(6, WireType.Bit64).double(message.lPFcutoffFreq);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const ControllerTuning = new ControllerTuning$Type();
/**
 * Type for protobuf message ControllerCommand
 */
class ControllerCommand$Type extends MessageType<ControllerCommand> {
    constructor() {
        super("ControllerCommand", [
            { no: 1, name: "fanState", kind: "enum", T: () => ["ComponentState", ComponentState] },
            { no: 2, name: "LPElementDutyCycle", kind: "scalar", jsonName: "LPElementDutyCycle", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 3, name: "HPElementDutyCycle", kind: "scalar", jsonName: "HPElementDutyCycle", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<ControllerCommand>): ControllerCommand {
        const message = { fanState: 0, lPElementDutyCycle: 0, hPElementDutyCycle: 0 };
        if (value !== undefined)
            reflectionMergePartial<ControllerCommand>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ControllerCommand): ControllerCommand {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* ComponentState fanState */ 1:
                    message.fanState = reader.int32();
                    break;
                case /* double LPElementDutyCycle = 2 [json_name = "LPElementDutyCycle"];*/ 2:
                    message.lPElementDutyCycle = reader.double();
                    break;
                case /* double HPElementDutyCycle = 3 [json_name = "HPElementDutyCycle"];*/ 3:
                    message.hPElementDutyCycle = reader.double();
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
    internalBinaryWrite(message: ControllerCommand, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* ComponentState fanState = 1; */
        if (message.fanState !== 0)
            writer.tag(1, WireType.Varint).int32(message.fanState);
        /* double LPElementDutyCycle = 2 [json_name = "LPElementDutyCycle"]; */
        if (message.lPElementDutyCycle !== 0)
            writer.tag(2, WireType.Bit64).double(message.lPElementDutyCycle);
        /* double HPElementDutyCycle = 3 [json_name = "HPElementDutyCycle"]; */
        if (message.hPElementDutyCycle !== 0)
            writer.tag(3, WireType.Bit64).double(message.hPElementDutyCycle);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const ControllerCommand = new ControllerCommand$Type();
/**
 * Type for protobuf message ControllerDataRequest
 */
class ControllerDataRequest$Type extends MessageType<ControllerDataRequest> {
    constructor() {
        super("ControllerDataRequest", [
            { no: 1, name: "requestType", kind: "enum", T: () => ["ControllerDataRequestType", ControllerDataRequestType] }
        ]);
    }
    create(value?: PartialMessage<ControllerDataRequest>): ControllerDataRequest {
        const message = { requestType: 0 };
        if (value !== undefined)
            reflectionMergePartial<ControllerDataRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ControllerDataRequest): ControllerDataRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* ControllerDataRequestType requestType */ 1:
                    message.requestType = reader.int32();
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
    internalBinaryWrite(message: ControllerDataRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* ControllerDataRequestType requestType = 1; */
        if (message.requestType !== 0)
            writer.tag(1, WireType.Varint).int32(message.requestType);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
export const ControllerDataRequest = new ControllerDataRequest$Type();
