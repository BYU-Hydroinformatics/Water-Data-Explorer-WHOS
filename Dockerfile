FROM tethysplatform/tethys-core:dev

#########
# SETUP #
#########

COPY . ${TETHYS_HOME}/Water-Data-Explorer-WHOS

# Activate tethys conda environment during build
ARG MAMBA_DOCKERFILE_ACTIVATE=1

# ###########
# # INSTALL #
# ###########

RUN cd ${TETHYS_HOME}/Water-Data-Explorer-WHOS &&\
  micromamba install --yes --file requirements.txt -c conda-forge && \
  pip install pywaterml && \
  tethys install -N -w

#########################
# CONFIGURE ENVIRONMENT #
#########################
EXPOSE 8080

######################################################
# CHANGE THE PROXY TIME REPLACING THE NGINX TEMPLATE #
######################################################

COPY docker_files/nginx /usr/lib/tethys/tethys/tethys_cli/gen_templates/

################
# COPY IN SALT #
################

## Be sure to be inside the docker_files folder ##
COPY docker_files/salt/ /srv/salt/

# #####################################
# # ADDITIONAL DATABASE CONFIGURATION #
# #####################################
COPY docker_files/fix.sql $HOME
COPY docker_files/configure_db.sh $HOME

# ######################
# # CONFIGURE FINAL_RUN #
# ######################
COPY docker_files/final_run.sh $HOME

# #######
# # RUN #
# #######
CMD bash final_run.sh
