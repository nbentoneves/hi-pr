import axios from 'axios';

export const setMockCustomRoutesVariants = async (variantId: string) => {
  const config = {
    method: 'post',
    url: 'http://127.0.0.1:3100/admin/mock-custom-routes-variants',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      id: variantId,
    }),
  };

  await axios(config);
};

export const resetMockCustomRoutesVariants = async () => {
  const config = {
    method: 'delete',
    url: 'http://127.0.0.1:3100/admin/mock-custom-routes-variants',
  };

  await axios(config);
};
