import { Icons } from "./icons";

type Props = {
  value: any;
  onchange: (event: any) => void;
};
export default function SearchInput({ onchange, value }: Props) {
  return (
    <div className="relative rounded-md border bg-white p-2">
      <button className="absolute left-2 top-1/2 -translate-y-1/2 ">
        <Icons.searchInput />
      </button>

      <input
        type="text"
        placeholder="Search here..."
        className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
        value={value}
        onChange={(e) => onchange(e.target.value)}
      />
    </div>
  );
}
