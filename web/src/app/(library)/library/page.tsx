import { LibraryApp } from "@/components/library/LibraryApp";
import { getLibrary } from "@/lib/library";

export default function LibraryPage() {
  return <LibraryApp items={getLibrary()} />;
}
