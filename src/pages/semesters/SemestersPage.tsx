import useGetAllSemesters from "../../hooks/useGetAllSemesters";
import Loader from "../../components/Loader";
import SemesterCard from "../../components/semesters/SemesterCard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../lib/axios";

const createSemesterSchema = z.object({
  name_ar: z.string().nonempty("Arabic name is required"),
  name_en: z.string().nonempty("English name is required"),
  description_ar: z.string().nonempty("Arabic description is required"),
  description_en: z.string().nonempty("English description is required"),
  slug: z.string().nonempty("Slug is required"),
  promotion_video_url: z.string().nonempty("Promotion video URL is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  image_url_ar: z.any(),
  image_url_en: z.any(),
});

type CreateSemesterFormDate = z.infer<typeof createSemesterSchema>;

const SemestersPage = () => {
  const { data: allSemesters, error, isLoading } = useGetAllSemesters();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSemesterFormDate>({
    resolver: zodResolver(createSemesterSchema),
  });

  // console.log(allSemesters);

  //handlers
  const onSubmit = async (data: CreateSemesterFormDate) => {
    try {
      const formData = new FormData();
      formData.append("name_ar", data.name_ar);
      formData.append("name_en", data.name_en);
      formData.append("description_ar", data.description_ar);
      formData.append("description_en", data.description_en);
      formData.append("slug", data.slug);
      formData.append("promotion_video_url", data.promotion_video_url);
      formData.append("price", String(data.price)); // must be string for FormData

      if (data.image_url_ar?.[0]) {
        formData.append("image_url_ar", data.image_url_ar[0]);
      }
      if (data.image_url_en?.[0]) {
        formData.append("image_url_en", data.image_url_en[0]);
      }

      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await axiosInstance.post("/semesters", formData);

      const dialog = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      dialog?.close();
    } catch (error) {
      console.error("Error creating semester:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.log(error);

    return <div>There was an error fetching semesters!</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl  font-semibold my-4">Semesters page</h1>

        {/* Add new semester */}
        <button
          className="btn btn-primary"
          onClick={() => {
            const dialog = document.getElementById(
              "my_modal_1"
            ) as HTMLDialogElement | null;
            if (dialog) {
              dialog.showModal();
            }
          }}
        >
          Add New Semester
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add new Semester !</h3>
            {/* <p className="py-4">
              Press ESC key or click the button below to close
            </p> */}
            <div className="modal-action">
              <form
                // Important: NO "method='dialog'" so we don't auto-close on submit
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
                className="space-y-4"
              >
                {/* Arabic Name */}
                <div>
                  <label className="block mb-1">Arabic Name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("name_ar")}
                  />
                  {errors.name_ar && (
                    <p className="text-red-500 text-sm">
                      {errors.name_ar.message}
                    </p>
                  )}
                </div>

                {/* English Name */}
                <div>
                  <label className="block mb-1">English Name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("name_en")}
                  />
                  {errors.name_en && (
                    <p className="text-red-500 text-sm">
                      {errors.name_en.message}
                    </p>
                  )}
                </div>

                {/* Arabic Description */}
                <div>
                  <label className="block mb-1">Arabic Description</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    {...register("description_ar")}
                  />
                  {errors.description_ar && (
                    <p className="text-red-500 text-sm">
                      {errors.description_ar.message}
                    </p>
                  )}
                </div>

                {/* English Description */}
                <div>
                  <label className="block mb-1">English Description</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    {...register("description_en")}
                  />
                  {errors.description_en && (
                    <p className="text-red-500 text-sm">
                      {errors.description_en.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block mb-1">Slug</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("slug")}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                {/* Promotion Video URL */}
                <div>
                  <label className="block mb-1">Promotion Video URL</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("promotion_video_url")}
                  />
                  {errors.promotion_video_url && (
                    <p className="text-red-500 text-sm">
                      {errors.promotion_video_url.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Image (Arabic) */}
                <div>
                  <label className="block mb-1">Image (Arabic)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    {...register("image_url_ar")}
                  />
                </div>

                {/* Image (English) */}
                <div>
                  <label className="block mb-1">Image (English)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    {...register("image_url_en")}
                  />
                </div>

                <div className="modal-action">
                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>

                  {/* Cancel Button (closes the modal) */}
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      const dialog = document.getElementById(
                        "my_modal_1"
                      ) as HTMLDialogElement | null;
                      dialog?.close();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 justify-items-center">
        {allSemesters?.map((semester) => (
          <SemesterCard
            created_at={semester.created_at}
            description_ar={semester.description_ar}
            id={semester.id}
            image_url_ar={semester.image_url_ar}
            name_ar={semester.name_ar}
            price={semester.price}
            slug={semester.slug}
          />
        ))}
      </div>
    </>
  );
};

export default SemestersPage;
