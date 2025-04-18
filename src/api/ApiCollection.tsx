import axios from "axios";
import axiosInstance from "../lib/axios";

// GET TOP DEALS
export const fetchTopDeals = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/topdeals")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL USERS
export const fetchTotalUsers = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalusers")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL PRODUCTS
export const fetchTotalProducts = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalproducts")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL RATIO
export const fetchTotalRatio = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalratio")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE
export const fetchTotalRevenue = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalrevenue")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL SOURCE
export const fetchTotalSource = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalsource")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL VISIT
export const fetchTotalVisit = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalvisit")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE BY PRODUCTS
export const fetchTotalRevenueByProducts = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalrevenue-by-product")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL PROFIT
export const fetchTotalProfit = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/totalprofit")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET ALL USERS

export const fetchUsers = async ({
  page = 1,
  limit = 10,
  search = "",
}): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get("/user", {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch users");
  }
};

//update user note
export const updateUserNote = async (id: string, note: string) => {
  return axiosInstance.patch(`/user/${id}`, { note });
};

// GET SINGLE USER
export const fetchSingleUser = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/users/${id}`)
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET ALL PRODUCTS
export const fetchProducts = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/products")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET SINGLE PRODUCT
export const fetchSingleProduct = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/products/${id}`)
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET ALL ORDERS
export const fetchOrders = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/orders")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET ALL POSTS
export const fetchPosts = async () => {
  const response = await axios
    .get("https://react-admin-ui-v1-api.vercel.app/posts")
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET ALL NOTES
export const fetchNotes = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/notes?q=`)
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};

// GET ALL LOGS
export const fetchLogs = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/logs`)
    .then((res) => {
      // console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      // console.log(err);
      throw err;
    });

  return response;
};
