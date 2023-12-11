import { Fragment, useMemo } from "react";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";

interface PaginationsProps {
  dataCount: number;
  limit: number;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  dataCount,
  limit,
  pageNumber,
  setPageNumber,
}: PaginationsProps) {
  const pageCount = Math.ceil(dataCount / limit);

  const getPageNumber = (pageCount: number, pageNumber: number) => {
    const storePageNumber: Array<number> = [];
    for (let i = 1; i <= pageCount; i++) {
      if (
        i < 3 ||
        (i > pageNumber - 2 && i < pageNumber + 2) ||
        i > pageCount - 2
      ) {
        storePageNumber.push(i);
      } else if (i === pageNumber - 2 || i === pageNumber + 2) {
        storePageNumber.push(0);
      }
    }

    return storePageNumber;
  };

  const pageNumberList = useMemo(
    () => getPageNumber(pageCount, pageNumber),
    [pageNumber, pageCount]
  );

  const handleChangePage = (changesType: "NEXT" | "PREV" | number) => {
    if (changesType === "NEXT") {
      if (pageNumber < pageCount) {
        setPageNumber((current) => current + 1);
      }
    }
    if (changesType === "PREV") {
      if (pageNumber > 1) {
        setPageNumber((current) => current - 1);
      }
    }
    if (typeof changesType === "number") {
      setPageNumber(changesType);
    }
  };

  return (
    <div className="flex w-full items-center justify-between border-t rounded-b-md border-gray-500  px-4 py-3 sm:px-6 text-black">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          type="button"
          onClick={() => handleChangePage("PREV")}
          className="relative inline-flex items-center rounded-md border border-gray-500 bg-white px-4 py-2 text-sm font-medium text-gray hover:bg-primary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => handleChangePage("NEXT")}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-500 bg-white px-4 py-2 text-sm font-medium text-gray hover:bg-primary"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Menampilkan{" "}
            <span className="font-medium">
              {pageNumber * limit - limit + 1}
            </span>{" "}
            sampai{" "}
            <span className="font-medium">
              {pageNumber * limit < dataCount ? pageNumber * limit : dataCount}
            </span>{" "}
            dari <span className="font-medium">{dataCount}</span> data
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={() => handleChangePage("PREV")}
              className="relative inline-flex items-center rounded-l-md border border-gray-500 bg-white px-2 py-2 text-sm font-medium text-gray hover:bg-primary focus:z-20"
            >
              <span className="sr-only">Previous</span>
              <MdArrowBackIos className="h-5 w-5" aria-hidden="true" />
            </button>
            {pageNumberList.map((i, n) => (
              <Fragment key={n}>
                {i !== 0 ? (
                  <button
                    onClick={() => handleChangePage(i)}
                    type="button"
                    aria-current="page"
                    className={`relative z-10 inline-flex items-center border ${
                      pageNumber !== i ? "bg-white" : "bg-orange"
                    } border-gray-500 px-4 py-2 text-sm font-medium text-gray-700 focus:z-20`}
                  >
                    {i}
                  </button>
                ) : (
                  <span className="relative inline-flex items-center border border-gray-500 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}
              </Fragment>
            ))}

            <button
              onClick={() => handleChangePage("NEXT")}
              type="button"
              className="relative inline-flex items-center rounded-r-md border border-gray-500 bg-white px-2 py-2 text-sm font-medium text-gray hover:bg-primary focus:z-20"
            >
              <span className="sr-only">Next</span>
              <MdArrowForwardIos className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
