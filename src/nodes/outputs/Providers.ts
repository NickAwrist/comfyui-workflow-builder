import type { BaseNode } from "../BaseNode";

/** @category Node Outputs */
export type ModelProviderNode = BaseNode & OutputsModel;
/** @category Node Outputs */
export interface OutputsModel {
  get MODEL(): number;
}

/** @category Node Outputs */
export type ClipProviderNode = BaseNode & OutputsClip;
/** @category Node Outputs */
export interface OutputsClip {
  get CLIP(): number;
}

/** @category Node Outputs */
export type VaeProviderNode = BaseNode & OutputsVAE;
/** @category Node Outputs */
export interface OutputsVAE {
  get VAE(): number;
}

/** @category Node Outputs */
export type ConditioningProviderNode = BaseNode & OutputsConditioning;
/** @category Node Outputs */
export interface OutputsConditioning {
  get CONDITIONING(): number;
}

/** @category Node Outputs */
export type LatentImageProviderNode = BaseNode & OutputsLatentImage;
/** @category Node Outputs */
export interface OutputsLatentImage {
  get LATENT_IMAGE(): number;
}

/** @category Node Outputs */
export type DecodedImageProviderNode = BaseNode & OutputsImage;
/** @category Node Outputs */
export interface OutputsImage {
  get IMAGE(): number;
}