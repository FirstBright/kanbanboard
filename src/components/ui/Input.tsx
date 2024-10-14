const Input = ({
    name,
    type,
    placeholder,
    value,
    disabled,
    fullWidth,
    onChange,
}: {
    name: string
    type: string
    placeholder?: string
    value?: string
    disabled?: boolean
    fullWidth?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <>
            <input
                name={name}
                type={type}
                required
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                onChange={onChange}
                className={`h-20 bg-transparent border-b
    text-3xl w-4/5 self-center focus:outline-none
    ${disabled && "opacity-50 cursor-default"}
    ${fullWidth && "w-full"}`}
            />
        </>
    )
}
export default Input
