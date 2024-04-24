export enum NodeImageUnclipEnum {
  //Node name
  LOAD_IMAGE = '%%load_image_node%%',
  CLIP_VISION_ENCODE = '%%clip_vision_encode_node%%',
  UNCLIP_CONDITION = '%%unclip_conditioning_node%%',

  //Unclip_condition Input
  UNCLIP_STRENGTH = '"%%unclip_conditioning_strength_input%%"',
  UNCLIP_NOISE_AUGMENTATION = '"%%unclip_conditioning_noise_augmentation_input%%"',
  //Unclip output
  UNCLIP_PRE_CONDITION = '%%precondition_node%%',

  //Load_image Input
  INPUT_IMAGE = '%%load_image_image_input%%',
  LOAD_UNCLIP_CHECKPOINT_NODE = '%%load_unclip_checkpoint_node%%',
}
