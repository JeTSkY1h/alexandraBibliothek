import { Input, InputProps } from "@chakra-ui/react";
import { useRef } from "react";

interface FileUploadProps extends InputProps{
    onFileChange: (file: File) => void;

}

const FileUploadInput = ({onFileChange}:FileUploadProps) => { 
    const inputRef = useRef<HTMLInputElement>(null);
    
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) {
            return;
        }
        onFileChange(e.target.files[0]);
    }

    return (
        <>
            <input type="file" accept=".png,.jpg,.bmp" style={{display: "none"}} ref={inputRef} onChange={onChange}/>
            <Input  placeholder="Artikelbild" onClick={() => inputRef.current?.click()}/>
        </>
    )
}

export default FileUploadInput;