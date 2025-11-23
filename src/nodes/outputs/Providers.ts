import type { BaseNode } from "../BaseNode";

export type ModelProviderNode = BaseNode & OutputsModel;
export interface OutputsModel {
  get MODEL(): number;
}

export type ClipProviderNode = BaseNode & OutputsClip;
export interface OutputsClip {
  get CLIP(): number;
}

export type VaeProviderNode = BaseNode & OutputsVAE;
export interface OutputsVAE {
  get VAE(): number;
}

export type ConditioningProviderNode = BaseNode & OutputsConditioning;
export interface OutputsConditioning {
  get CONDITIONING(): number;
}

export type LatentImageProviderNode = BaseNode & OutputsLatentImage;
export interface OutputsLatentImage {
  get LATENT_IMAGE(): number;
}

export type DecodedImageProviderNode = BaseNode & OutputsImage;
export interface OutputsImage {
  get IMAGE(): number;
}