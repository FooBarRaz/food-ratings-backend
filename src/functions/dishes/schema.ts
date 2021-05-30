export default {
  type: "object",
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
} as const;

export const review = {
  type: "object",
  properties: {
    rating: { type: 'number' },
    comments: { type: 'string' }
  },
  required: ['rating']
};
