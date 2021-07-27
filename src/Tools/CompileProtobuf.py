"""
Compile all protobuf definitions to generated cpp headers
"""

import os
import glob
import subprocess
from pathlib import Path
import argparse

def compileSingleFile(protoFile):
    """
    Compile a single .proto file in PBProtoBuf/Proto into the corresponding 
    cpp header file in src/app/ProtoBuf
    """
    # Check PBPATH exists
    if os.environ.get('PBCLIENTPATH') == None:
        raise ValueError("PBCLIENTPATH variable is not set")

    # If .proto extension doesn't exist, add it
    name, extension = os.path.splitext(protoFile)
    if extension == '':
        extension = '.proto'
    elif not extension == '.proto':
        raise ValueError(f"File {protoFile} is not a .proto file")

    protoFile = name + extension

    print(f"Compiling {protoFile}")

    # Generate the protobuf header
    protoPath = os.path.join(os.environ.get("PBCLIENTPATH"), "PBProtoBuf/Proto/")
    tsOutPath = os.path.join(os.environ.get("PBCLIENTPATH"), "src/app/ProtoBuf")

    proc = subprocess.run(["npx", 'protoc', f"--ts_out", tsOutPath, "--ts_opt", "enable_angular_annotations", "--ts_opt", "long_type_string",
                          f"--proto_path", protoPath, "--experimental_allow_proto3_optional", protoFile])
    if proc.returncode == 0:
        print("Success")
    else:
        print("Compilation failed")


def compileAll():
    """
    Fetch all .proto files in PBProtoBuf/Proto and compile them into
    cpp headers in src/app/ProtoBuf
    """

    # Check PBPATH exists
    if os.environ.get('PBCLIENTPATH') == None:
        raise ValueError("PBCLIENTPATH variable is not set")

    protoPath = os.path.join(os.environ.get("PBCLIENTPATH"), "PBProtoBuf/Proto/*.proto")
    for file in glob.glob(protoPath):
        protoFile = Path(file).name
        compileSingleFile(protoFile)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-a", "--all", help="Compile all .proto files", action="store_true")
    parser.add_argument("-n", "--name", type=str, help="Name of .proto file to compile")
    args = parser.parse_args()

    if args.all:
        compileAll()
    else:
        if args.name:
            compileSingleFile(args.name)
        else:
            print("Please pass the name of a .proto file to compile, or use the --all flag")
